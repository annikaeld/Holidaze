import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import {
  House,
  CalendarDays,
  UserRound,
  LogOut,
  LogIn,
  ChevronDown,
} from "lucide-react";
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
      className={`fixed inset-x-0 bottom-0 z-50 dark:border-t dark:border-card-border shadow-[0_-4px_12px_rgba(0,0,0,0.08)] dark:shadow-none bg-card pb-[env(safe-area-inset-bottom)] transition-transform duration-300 ease-in-out lg:hidden ${
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex min-w-20 cursor-pointer flex-col items-center gap-1 text-xs text-muted-foreground hover:text-primary"
            >
              <span className="relative inline-flex">
                <UserRound size={22} aria-hidden="true" />
                <ChevronDown
                  size={16}
                  aria-hidden="true"
                  className="absolute left-full top-1/2 ml-1 -translate-y-1/2"
                />
              </span>
              <span>Account</span>
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
                to="/venues"
                className="cursor-pointer rounded-md px-3 py-2 text-sm focus:bg-primary/15 focus:text-foreground"
              >
                Venues
              </Link>
            </DropdownMenuItem>

            {user ? (
              <>
                <DropdownMenuItem asChild>
                  <Link
                    to="/profile"
                    aria-current={pathname === "/profile" ? "page" : undefined}
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
              </>
            ) : (
              <>
                <DropdownMenuSeparator className="my-1 bg-border" />

                <DropdownMenuItem asChild>
                  <Link
                    to="/login"
                    className="cursor-pointer gap-2 rounded-md px-3 py-2 text-sm focus:bg-primary/15 focus:text-foreground"
                  >
                    <LogIn size={16} aria-hidden="true" />
                    Log in
                  </Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
