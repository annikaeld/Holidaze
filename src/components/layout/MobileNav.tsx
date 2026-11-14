import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { House, CalendarDays, UserRound, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/context/useAuth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function MobileNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }
  const { pathname } = useLocation();
  const hideMobileNav =
    /^\/venues\/[^/]+\/?$/.test(pathname) ||
    ["/booking/summary", "/login", "/register"].includes(pathname);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let previousY = window.scrollY;

    function handleScroll() {
      const currentY = window.scrollY;
      const difference = currentY - previousY;

      if (currentY < 50) {
        setIsVisible(true);
      } else if (difference > 5) {
        setIsVisible(false);
      } else if (difference < -5) {
        setIsVisible(true);
      }

      previousY = currentY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const items = [
    { to: "/", label: "Home", icon: House },
    {
      to: user ? "/my-bookings" : "/login",
      label: "My bookings",
      icon: CalendarDays,
    },
  ];

  if (hideMobileNav) return null;
  return (
    <nav
      aria-label="Mobile navigation"
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] transition-transform duration-300 ease-in-out lg:hidden ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex h-16 items-center justify-around">
        {items.map(({ to, label, icon: Icon }) => (
          <Link
            key={label}
            to={to}
            aria-current={pathname === to ? "page" : undefined}
            className={`flex min-w-20 flex-col items-center gap-1 text-xs ${
              pathname === to
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Icon size={22} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex min-w-20 cursor-pointer flex-col items-center gap-1 text-xs text-muted-foreground hover:text-primary"
              >
                <UserRound size={22} aria-hidden="true" />
                <span>Profile</span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              side="top"
              sideOffset={12}
              className="min-w-44 rounded-lg border-border bg-card p-2 text-foreground shadow-lg"
            >
              <DropdownMenuItem asChild>
                <Link
                  to="/profile"
                  className="cursor-pointer rounded-md px-3 py-2 text-sm focus:bg-primary/15 focus:text-foreground"
                >
                  My profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to={user.venueManager ? "/my-venues" : "/list-venue"}
                  className="cursor-pointer rounded-md px-3 py-2 text-sm focus:bg-primary/15 focus:text-foreground"
                >
                  {user.venueManager ? "My venues" : "Become a venue manager"}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1 bg-border" />

              <DropdownMenuItem
                onSelect={handleLogout}
                className="cursor-pointer gap-2 rounded-md px-3 py-2 text-sm focus:bg-primary/15 focus:text-foreground"
              >
                <LogOut size={16} aria-hidden="true" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            to="/login"
            className="flex min-w-20 flex-col items-center gap-1 text-xs text-muted-foreground hover:text-primary"
          >
            <UserRound size={22} aria-hidden="true" />
            <span>Log in</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
