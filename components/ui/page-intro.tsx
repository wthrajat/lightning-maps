import type { ReactNode } from "react";

type PageIntroProps = {
  marker: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageIntro({ marker, title, description, actions }: PageIntroProps) {
  return (
    <header className="page-intro">
      <p className="page-intro__marker">{marker}</p>
      <div className="page-intro__copy">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions ? <div className="page-intro__actions">{actions}</div> : null}
    </header>
  );
}
