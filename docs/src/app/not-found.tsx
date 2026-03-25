'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const router = useRouter();

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 text-center p-8">
      {/* Số 404 lớn */}
      <h1 className="text-8xl sm:text-9xl font-extrabold text-purple-700 mb-4 drop-shadow-md">
        404
      </h1>

      {/* Dòng mô tả */}
      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-3">
        Trang không tồn tại
      </h2>
      <p className="text-gray-600 max-w-md mx-auto mb-8">
        Có vẻ như bạn đã nhập sai địa chỉ hoặc trang này đã bị xóa.  
        Hãy quay lại hoặc về trang chủ để tiếp tục.
      </p>

      {/* Nút hành động */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2 border-gray-300 hover:border-purple-500 text-gray-700 hover:text-purple-700 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại
        </Button>

      </div>

      {/* Footer nhỏ */}
    </section>
  );
}
