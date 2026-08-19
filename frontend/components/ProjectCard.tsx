import Link from "next/link";
import Image from "next/image";

export default function ProjectCard({ project, index, priority }: { project: any; index?: number; priority?: boolean }) {
  const href = "/projects/" + project.slug;

  return (
    <article className="group relative overflow-hidden">
      <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
        <span className="relative block aspect-[47/32] overflow-hidden rounded-t-card">
          {project.heroImage ? (
            <Image src={project.heroImage} alt="" fill quality={90} sizes="(min-width: 992px) 33vw, (min-width: 768px) 50vw, 100vw" priority={priority} className="object-cover" />
          ) : (
            <span className="bg-surfaceAlt border border-border absolute inset-0 block" />
          )}
        </span>
      </Link>

      <div className="relative -mt-px px-px">
        <div className="bg-surface transition-all duration-500 md:group-hover:-translate-y-full md:group-hover:bg-white">
          <Link href={href} className="text-dark hover:text-primary block rounded-b-card px-[15px] py-[25px] text-center text-[24px] leading-[28px] font-light shadow-[0_0_3px_#d9d9d9]">
            {project.title}
          </Link>
        </div>
      </div>
    </article>
  );
}
