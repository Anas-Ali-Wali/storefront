import { Component } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent {
faqs = [
    {
      q: 'How long does delivery take?',
      a: 'Standard delivery takes 3–5 business days. Express delivery (1–2 days) is available at checkout. Orders above Rs. 2,000 get free standard delivery.',
      open: false
    },
    {
      q: 'What is your return policy?',
      a: 'We offer a 7-day easy return policy. Items must be unused and in original packaging. Refund is processed within 3–5 business days after we receive the item.',
      open: false
    },
    {
      q: 'Which payment methods do you accept?',
      a: 'We accept JazzCash, EasyPaisa, Visa/Mastercard, and Cash on Delivery (COD). All online payments are secured and encrypted.',
      open: false
    },
    {
      q: 'How do I track my order?',
      a: 'After placing your order, you\'ll receive a confirmation email with a tracking link. You can also check order status under My Orders in your account.',
      open: false
    },
    {
      q: 'Can I cancel or modify my order?',
      a: 'Orders can be cancelled or modified within 1 hour of placement. After that, the order goes into processing. Contact support immediately for urgent requests.',
      open: false
    }
  ];

  form = { name: '', email: '', subject: 'Order issue', message: '' };

  toggle(faq: any) {
    faq.open = !faq.open;
  }

  onSubmit() {
    console.log('Form submitted:', this.form);
    // apna API call yahan lagao
  }

}
