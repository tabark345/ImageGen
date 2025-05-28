
import { Sparkles, Image as ImageIcon, Download, GalleryHorizontalEnd, Loader2, Trash2, Bot } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

export const Icons = {
  Logo: (props: LucideProps) => <Sparkles {...props} />,
  Image: ImageIcon,
  Download: Download,
  Gallery: GalleryHorizontalEnd,
  Spinner: (props: LucideProps) => <Loader2 className="animate-spin" {...props} />,
  Trash: Trash2,
  Bot: Bot,
};
