import { Facebook, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FbShareButton({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const handleShare = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
  };

  return (
    <Button variant="ghost" className="gap-2" onClick={handleShare}>
      <Facebook className="h-5 w-5" /> Chia sẻ
    </Button>
  );
}
