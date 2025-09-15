<?php

/**
 * WebSocket Server for AASTU Academic Archive
 * This file provides the setup for real-time communication
 */

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Illuminate\Support\Facades\Log;

class WebSocketHandler implements MessageComponentInterface
{
    protected $clients;
    protected $userConnections;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage;
        $this->userConnections = [];
    }

    public function onOpen(ConnectionInterface $conn)
    {
        // Store the new connection
        $this->clients->attach($conn);
        
        // Extract user token from query string
        $query = parse_url($conn->httpRequest->getUri(), PHP_URL_QUERY);
        parse_str($query, $params);
        
        if (isset($params['token'])) {
            $token = $params['token'];
            $user = $this->validateToken($token);
            
            if ($user) {
                $this->userConnections[$user->id] = $conn;
                $conn->user = $user;
                
                Log::info("User {$user->email} connected to WebSocket");
                
                // Send connection confirmation
                $conn->send(json_encode([
                    'type' => 'connection_established',
                    'message' => 'Connected successfully',
                    'user_id' => $user->id
                ]));
            } else {
                $conn->send(json_encode([
                    'type' => 'error',
                    'message' => 'Invalid token'
                ]));
                $conn->close();
            }
        } else {
            $conn->send(json_encode([
                'type' => 'error',
                'message' => 'No token provided'
            ]));
            $conn->close();
        }
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        $data = json_decode($msg, true);
        
        if (!$data || !isset($data['type'])) {
            return;
        }

        switch ($data['type']) {
            case 'ping':
                $from->send(json_encode([
                    'type' => 'pong',
                    'timestamp' => now()->toISOString()
                ]));
                break;
                
            case 'subscribe':
                $this->handleSubscription($from, $data);
                break;
                
            case 'unsubscribe':
                $this->handleUnsubscription($from, $data);
                break;
                
            default:
                Log::info("Unknown message type: {$data['type']}");
        }
    }

    public function onClose(ConnectionInterface $conn)
    {
        if (isset($conn->user)) {
            unset($this->userConnections[$conn->user->id]);
            Log::info("User {$conn->user->email} disconnected from WebSocket");
        }
        
        $this->clients->detach($conn);
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        Log::error("WebSocket error: " . $e->getMessage());
        $conn->close();
    }

    protected function validateToken($token)
    {
        try {
            // Validate JWT token
            $payload = JWT::decode($token, config('jwt.secret'), ['HS256']);
            
            // Get user from database
            $user = \App\Models\User::find($payload->sub);
            
            if ($user && $user->status === 'active') {
                return $user;
            }
            
            return null;
        } catch (\Exception $e) {
            Log::error("Token validation error: " . $e->getMessage());
            return null;
        }
    }

    protected function handleSubscription($conn, $data)
    {
        if (!isset($data['channel'])) {
            return;
        }

        $channel = $data['channel'];
        
        // Store subscription
        if (!isset($conn->subscriptions)) {
            $conn->subscriptions = [];
        }
        
        $conn->subscriptions[] = $channel;
        
        $conn->send(json_encode([
            'type' => 'subscribed',
            'channel' => $channel
        ]));
    }

    protected function handleUnsubscription($conn, $data)
    {
        if (!isset($data['channel']) || !isset($conn->subscriptions)) {
            return;
        }

        $channel = $data['channel'];
        $conn->subscriptions = array_filter($conn->subscriptions, function($sub) use ($channel) {
            return $sub !== $channel;
        });
        
        $conn->send(json_encode([
            'type' => 'unsubscribed',
            'channel' => $channel
        ]));
    }

    /**
     * Broadcast message to all connected clients
     */
    public function broadcast($message, $channel = null)
    {
        $data = json_encode($message);
        
        foreach ($this->clients as $client) {
            if ($channel && isset($client->subscriptions)) {
                if (in_array($channel, $client->subscriptions)) {
                    $client->send($data);
                }
            } else {
                $client->send($data);
            }
        }
    }

    /**
     * Send message to specific user
     */
    public function sendToUser($userId, $message)
    {
        if (isset($this->userConnections[$userId])) {
            $this->userConnections[$userId]->send(json_encode($message));
        }
    }

    /**
     * Send message to users by role
     */
    public function sendToRole($role, $message)
    {
        foreach ($this->userConnections as $userId => $conn) {
            if ($conn->user->role === $role) {
                $conn->send(json_encode($message));
            }
        }
    }
}

// WebSocket server setup
if (php_sapi_name() === 'cli') {
    $server = IoServer::factory(
        new HttpServer(
            new WsServer(
                new WebSocketHandler()
            )
        ),
        6001
    );

    echo "WebSocket server started on port 6001\n";
    $server->run();
}
