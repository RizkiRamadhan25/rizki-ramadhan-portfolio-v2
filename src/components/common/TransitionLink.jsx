import { useContext } from "react";
import { Link } from "react-router";

import { PageTransitionContext } from "../../context/page-transition-context";

export default function TransitionLink({ to, onClick, replace, state, target, ...props }) {
  const navigateWithTransition = useContext(PageTransitionContext);

  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || target === "_blank") return;

    const destination = new URL(String(to), window.location.href);
    const current = new URL(window.location.href);
    if (destination.pathname === current.pathname && destination.search === current.search) return;

    if (!navigateWithTransition) return;
    event.preventDefault();
    navigateWithTransition(to, { replace, state });
  };

  return <Link to={to} onClick={handleClick} replace={replace} state={state} target={target} {...props} />;
}
