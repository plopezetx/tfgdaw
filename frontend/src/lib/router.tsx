/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";

type NavigateOptions = {
  replace?: boolean;
};

type RouterContextValue = {
  path: string;
  navigate: (to: string, options?: NavigateOptions) => void;
};

const RouterContext = createContext<RouterContextValue | undefined>(undefined);

function getCurrentPath() {
  return window.location.pathname || "/";
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(getCurrentPath);

  useEffect(() => {
    function handlePopState() {
      setPath(getCurrentPath());
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const value = useMemo<RouterContextValue>(
    () => ({
      path,
      navigate(to, options) {
        if (options?.replace) {
          window.history.replaceState(null, "", to);
        } else {
          window.history.pushState(null, "", to);
        }
        setPath(getCurrentPath());
      },
    }),
    [path]
  );

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useNavigate() {
  return useRouter().navigate;
}

export function usePath() {
  return useRouter().path;
}

export function useParams<T extends Record<string, string | undefined>>() {
  const path = usePath();
  const [, route, value] = path.split("/");

  if (route === "app") {
    return { projectId: value } as unknown as T;
  }

  if (route === "p") {
    return { slug: value } as unknown as T;
  }

  if (route === "u") {
    return { username: value } as unknown as T;
  }

  return {} as T;
}

export function Navigate({
  to,
  replace,
}: {
  to: string;
  replace?: boolean;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace });
  }, [navigate, replace, to]);

  return null;
}

export function Link({
  to,
  children,
  onClick,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
}) {
  const navigate = useNavigate();

  return (
    <a
      {...props}
      href={to}
      onClick={(event) => {
        onClick?.(event);

        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        ) {
          return;
        }

        event.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("Router hooks must be used inside RouterProvider");
  }
  return context;
}
