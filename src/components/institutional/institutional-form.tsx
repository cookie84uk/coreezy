'use client';

import { useState } from 'react';

export function InstitutionalForm() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/institutional/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setStatus('success');
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  if (status === 'success') {
    return (
      <div className="card p-8 text-center">
        <div className="text-4xl mb-4">✓</div>
        <h3 className="text-xl font-bold text-coreezy-100 mb-2">
          Inquiry Submitted
        </h3>
        <p className="text-coreezy-400 mb-6">
          Thank you for your interest. We&apos;ll be in touch within 1-2 business days.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="btn-outline px-6 py-2"
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-coreezy-300 mb-1">
            Company Name *
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            required
            value={formData.companyName}
            onChange={handleChange}
            className="input"
            placeholder="Acme Capital"
          />
        </div>

        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-coreezy-300 mb-1">
            Contact Name *
          </label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            required
            value={formData.contactName}
            onChange={handleChange}
            className="input"
            placeholder="Jane Smith"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-coreezy-300 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="input"
            placeholder="jane@acme.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-coreezy-300 mb-1">
            Phone (optional)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="input"
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-coreezy-300 mb-1">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="input resize-none"
            placeholder="Tell us about your delegation needs, timeline, and any specific requirements..."
          />
        </div>

        {status === 'error' && (
          <div className="p-3 rounded-lg bg-red-900/30 border border-red-700/50 text-sm text-red-300">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary w-full py-3"
        >
          {status === 'loading' ? 'Submitting...' : 'Submit Inquiry'}
        </button>
      </div>

      <p className="mt-4 text-xs text-coreezy-500 text-center">
        Your information is confidential and will only be used to respond to your inquiry.
      </p>
    </form>
  );
}
