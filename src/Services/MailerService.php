<?php

namespace App\Services;

use Symfony\Bridge\Twig\Mime\BodyRenderer;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Twig\Environment;
use Twig\Loader\FilesystemLoader;

class MailerService
{
    private $mailer;

    public function __construct(MailerInterface $mailer)
    {
        $this->mailer = $mailer;
    }

    public function sendMail($to, $subject, $text, $html, $params, $from="web@logilink.fr")
    {
        // Send email
        $email = (new TemplatedEmail())
            ->from($from)
            ->to(new Address($to))
            ->subject($subject)
            ->htmlTemplate($html)
            ->context($params)
        ;
        $loader = new FilesystemLoader(dirname(__DIR__) . '/../templates/');

        $twigEnv = new Environment($loader);
        $bodyRenderer = new BodyRenderer($twigEnv);
        $bodyRenderer->render($email);

        try {
            $this->mailer->send($email);
            return true;
        } catch (TransportExceptionInterface $e) {
            return 'Le message n\'a pas pu être délivré. Veuillez contacter le support.';
        }
    }
}