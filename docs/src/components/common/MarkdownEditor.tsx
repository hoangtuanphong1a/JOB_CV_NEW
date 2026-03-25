import { Textarea } from "@/components/ui/textarea";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const MarkdownEditor = ({ value, onChange, placeholder }: MarkdownEditorProps) => {
  return (
    <div className="h-full">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[500px] resize-none border-0 bg-editor-bg focus-visible:ring-0 font-mono text-sm leading-relaxed p-6"
      />
    </div>
  );
};
