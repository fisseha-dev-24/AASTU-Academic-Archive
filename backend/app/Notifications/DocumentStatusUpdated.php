<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class DocumentStatusUpdated extends Notification
{
    use Queueable;

    protected $document;
    protected $status;

    public function __construct($document, $status)
    {
        $this->document = $document;
        $this->status = $status;
    }

    public function via($notifiable)
    {
        return ['mail', 'database']; // can also log
    }

    public function toMail($notifiable)
    {
        return (new \Illuminate\Notifications\Messages\MailMessage)
            ->subject('Your document status has been updated')
            ->line("Your document '{$this->document->title}' status: {$this->status}")
            ->action('View Document', url('/documents/'.$this->document->id));
    }
}
