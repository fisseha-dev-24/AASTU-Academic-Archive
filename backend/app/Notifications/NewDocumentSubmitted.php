<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewDocumentSubmitted extends Notification
{
    use Queueable;

    protected $document;

    public function __construct($document)
    {
        $this->document = $document;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new \Illuminate\Notifications\Messages\MailMessage)
            ->subject('New Document Submitted')
            ->line("A new document '{$this->document->title}' has been submitted.")
            ->action('Review Document', url('/documents/'.$this->document->id));
    }
}
