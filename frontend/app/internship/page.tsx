'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Navbar from "@/components/home/header/navbar";
import Footer from "@/components/home/footer-section";

export default function Internship() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    course: '',
    year: '',
    domain: '',
    skills: '',
    experience: '',
    whyInterested: '',
    availability: '',
    resumeLink: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Save internship application to Supabase
      const { error: insertError } = await supabase
        .from('internship_applications')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            college: formData.college,
            course: formData.course,
            year: formData.year,
            domain: formData.domain,
            skills: formData.skills,
            experience: formData.experience,
            why_interested: formData.whyInterested,
            availability: formData.availability,
            resume_link: formData.resumeLink,
            applied_at: new Date().toISOString(),
          }
        ]);

      if (insertError) {
        throw insertError;
      }

      setSuccess(true);
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        college: '',
        course: '',
        year: '',
        domain: '',
        skills: '',
        experience: '',
        whyInterested: '',
        availability: '',
        resumeLink: '',
      });
    } catch (error: Error | unknown) {
      setError(error instanceof Error ? error.message : 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
          <Card className="w-full max-w-md shadow-lg border border-gray-200">
            <CardContent className="pt-8">
              <div className="text-center">
                <div className="mx-auto mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 border-2 border-green-200">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                  Application Submitted!
                </h2>
                <p className="mt-3 text-sm text-gray-700">
                  Thank you for applying to our internship program. We&apos;ve received your application and will review it carefully within 5-7 business days.
                </p>
                <p className="mt-4 text-xs text-gray-600">
                  A confirmation email has been sent to your email address.
                </p>
                <Button
                  onClick={() => setSuccess(false)}
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Submit Another Application
                </Button>
                <Link href="/">
                  <Button variant="outline" className="mt-3 w-full">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-12">
            <div className="mb-4">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Internship Application
              </h1>
              <p className="text-lg text-gray-600">
                Join Prasunet and accelerate your career growth
              </p>
            </div>
            <div className="h-1 w-20 bg-blue-600"></div>
          </div>

          <Card className="shadow-lg border border-gray-200">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-10">
                {error && (
                  <Alert variant="destructive" className="border-red-300 bg-red-50">
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                {/* Personal Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-gray-700 font-medium">Full Name *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          type="text"
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200"></div>

                {/* Academic Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Background</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="college" className="text-gray-700 font-medium">College/University *</Label>
                        <Input
                          id="college"
                          name="college"
                          type="text"
                          placeholder="MIT, Stanford, etc."
                          value={formData.college}
                          onChange={handleChange}
                          required
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="course" className="text-gray-700 font-medium">Course/Program *</Label>
                        <Input
                          id="course"
                          name="course"
                          type="text"
                          placeholder="B.Tech CSE, BCA, etc."
                          value={formData.course}
                          onChange={handleChange}
                          required
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="space-y-2">
                        <Label htmlFor="year" className="text-gray-700 font-medium">Year of Study *</Label>
                        <select
                          id="year"
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          required
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full p-2 rounded"
                        >
                          <option value="">Select your year</option>
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                          <option value="5th Year">5th Year</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="domain" className="text-gray-700 font-medium">Preferred Domain *</Label>
                        <select
                          id="domain"
                          name="domain"
                          value={formData.domain}
                          onChange={handleChange}
                          required
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full p-2 rounded"
                        >
                          <option value="">Select a domain</option>
                          <option value="Web Development">Web Development</option>
                          <option value="Mobile App Development">Mobile App Development</option>
                          <option value="Data Science">Data Science</option>
                          <option value="Machine Learning">Machine Learning</option>
                          <option value="Cybersecurity">Cybersecurity</option>
                          <option value="Cloud Computing">Cloud Computing</option>
                          <option value="DevOps">DevOps</option>
                          <option value="UI/UX Design">UI/UX Design</option>
                          <option value="Digital Marketing">Digital Marketing</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200"></div>

                {/* Skills and Experience */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Experience</h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="skills" className="text-gray-700 font-medium">Technical Skills *</Label>
                        <Textarea
                          id="skills"
                          name="skills"
                          placeholder="e.g., JavaScript, Python, React, Node.js, SQL"
                          value={formData.skills}
                          onChange={handleChange}
                          rows={3}
                          required
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                        />
                        <p className="text-xs text-gray-500">Separate multiple skills with commas</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience" className="text-gray-700 font-medium">Previous Experience</Label>
                        <Textarea
                          id="experience"
                          name="experience"
                          placeholder="Describe any previous projects, internships, freelance work, or relevant experience..."
                          value={formData.experience}
                          onChange={handleChange}
                          rows={3}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200"></div>

                {/* Resume and Documents */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume & Documents</h3>
                    <div className="space-y-2">
                      <Label htmlFor="resumeLink" className="text-gray-700 font-medium">Resume Link *</Label>
                      <Input
                        id="resumeLink"
                        name="resumeLink"
                        type="url"
                        placeholder="https://drive.google.com/file/... or your portfolio link"
                        value={formData.resumeLink}
                        onChange={handleChange}
                        required
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500">Share your resume via Google Drive, Dropbox, or your portfolio (PDF recommended)</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200"></div>

                {/* Motivation & Availability */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Motivation & Availability</h3>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="whyInterested" className="text-gray-700 font-medium">Why are you interested in this internship? *</Label>
                        <Textarea
                          id="whyInterested"
                          name="whyInterested"
                          placeholder="Tell us what excites you about Prasunet and what you hope to achieve during the internship..."
                          value={formData.whyInterested}
                          onChange={handleChange}
                          rows={4}
                          required
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="availability" className="text-gray-700 font-medium">Availability *</Label>
                        <select
                          id="availability"
                          name="availability"
                          value={formData.availability}
                          onChange={handleChange}
                          required
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full p-2 rounded"
                        >
                          <option value="">Select your availability</option>
                          <option value="Full-time (40 hours/week)">Full-time (40 hours/week)</option>
                          <option value="Part-time (20 hours/week)">Part-time (20 hours/week)</option>
                          <option value="Flexible">Flexible</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200"></div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>

                <p className="text-center text-xs text-gray-600 pt-4">
                  By submitting this form, you agree to our terms and privacy policy. We&apos;ll review your information carefully.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
