"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import ApplicationService, { CreateApplicationDto } from "@/services/applicationService";
import UploadService from "@/services/uploadService";

interface JobApplicationFormProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resume: File | null;
}

export default function JobApplicationForm({
  jobId,
  jobTitle,
  companyName,
  onSuccess,
  onCancel,
  isModal = true
}: JobApplicationFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: keyof ApplicationFormData, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null); // Clear error when user starts typing
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const validation = UploadService.validateFile(file);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        return;
      }
    }
    handleInputChange('resume', file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.resume) {
        throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
      }

      // Upload resume first
      let resumeUrl: string | undefined;
      if (formData.resume) {
        setUploadProgress(50);
        resumeUrl = await UploadService.uploadFile(formData.resume, 'resume');
        setUploadProgress(100);
      }

      // Create application
      const applicationData: CreateApplicationDto = {
        jobId,
        coverLetter: formData.coverLetter.trim() || undefined,
        resumeUrl,
        source: 'WEBSITE'
      };

      await ApplicationService.createApplication(applicationData);

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/employer");
        onSuccess?.();
      }, 2000);

    } catch (err: unknown) {
      console.error('Application submission error:', err);
      const errorMessage = err instanceof Error
        ? err.message
        : (typeof err === 'object' && err !== null && 'response' in err)
          ? (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Có lỗi xảy ra khi gửi đơn ứng tuyển. Vui lòng thử lại."
          : "Có lỗi xảy ra khi gửi đơn ứng tuyển. Vui lòng thử lại.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const FormContent = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Job Info */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-1">Ứng tuyển vị trí</h3>
        <p className="text-sm text-gray-600">
          <strong>{jobTitle}</strong> tại <strong>{companyName}</strong>
        </p>
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Thông tin cá nhân</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Họ và tên *</Label>
            <Input
              id="fullName"
              required
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Nhập họ và tên của bạn"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="phone">Số điện thoại *</Label>
            <Input
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Nhập số điện thoại"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Nhập địa chỉ email"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Cover Letter */}
      <div>
        <Label htmlFor="coverLetter">Thư xin việc (tùy chọn)</Label>
        <Textarea
          id="coverLetter"
          value={formData.coverLetter}
          onChange={(e) => handleInputChange('coverLetter', e.target.value)}
          placeholder="Giới thiệu ngắn gọn về bản thân, kinh nghiệm và lý do ứng tuyển vị trí này..."
          rows={4}
          disabled={isSubmitting}
        />
        <p className="text-xs text-gray-500 mt-1">
          Mô tả ngắn gọn về kỹ năng và kinh nghiệm của bạn
        </p>
      </div>

      {/* Resume Upload */}
      <div>
        <Label htmlFor="resume">CV/Resume *</Label>
        <div className="mt-2">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
              disabled={isSubmitting}
              required
            />
            <label htmlFor="resume" className="cursor-pointer">
              {formData.resume ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="h-8 w-8 text-green-500" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{formData.resume.name}</p>
                    <p className="text-sm text-gray-500">
                      {(formData.resume.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleInputChange('resume', null);
                    }}
                    className="text-red-500 hover:text-red-700"
                    disabled={isSubmitting}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Chọn file CV</p>
                    <p className="text-sm text-gray-500">
                      PDF, DOC, DOCX hoặc TXT (tối đa 5MB)
                    </p>
                  </div>
                </div>
              )}
            </label>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Đang tải lên CV...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
        )}
        <Button
          type="submit"
          className="flex-1 bg-[#f26b38] hover:bg-[#e05a27]"
          disabled={isSubmitting || !formData.resume}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Đang gửi...
            </>
          ) : (
            "Gửi đơn ứng tuyển"
          )}
        </Button>
      </div>
    </form>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Ứng tuyển việc làm</h3>
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={isSubmitting}
                >
                  ✕
                </button>
              )}
            </div>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Ứng tuyển thành công!
                </h3>
                <p className="text-gray-600">
                  Đơn ứng tuyển của bạn đã được gửi đến nhà tuyển dụng.
                  Chúng tôi sẽ thông báo khi có cập nhật.
                </p>
              </motion.div>
            ) : (
              <FormContent />
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Standalone page version
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Ứng tuyển việc làm</CardTitle>
          </CardHeader>
          <CardContent>
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Ứng tuyển thành công!
                </h3>
                <p className="text-gray-600">
                  Đơn ứng tuyển của bạn đã được gửi đến nhà tuyển dụng.
                  Chúng tôi sẽ thông báo khi có cập nhật.
                </p>
              </motion.div>
            ) : (
              <FormContent />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
