// components/TableOfContents.tsx
type TOCItem = {
  id: string;
  text: string;
};

export default function TableOfContents({ toc }: { toc: TOCItem[] }) {
  if (toc.length < 3) return null;

  return (
    <aside className="mb-8 p-4 bg-gray-50 border rounded-md">
      <h2 className="text-lg font-semibold mb-2 dark:text-black">Mục lục</h2>
      <ul className="space-y-1 text-sm list-disc pl-4">
        {toc.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="text-blue-600 hover:underline">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
