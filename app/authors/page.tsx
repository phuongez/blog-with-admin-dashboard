import { Suspense } from "react";
import AuthorsPageContent from "../../components/AuthorsPageContent";

export default function AuthorsPage() {
  return (
    <Suspense fallback={<p className="text-center">Đang tải tác giả...</p>}>
      <AuthorsPageContent />
    </Suspense>
  );
}
