interface SidebarProps {
  isExpanded: boolean;
}

export default function Sidebar({ isExpanded }: SidebarProps) {
  return (
    <aside
      className={`
        bg-white border-r h-screen transition-all duration-300 ease-in-out
        ${isExpanded ? 'w-[260px]' : 'w-[80px]'}
      `}
    >
      {/* Contenu de ta sidebar */}
      Sidebar
    </aside>
  );
}
