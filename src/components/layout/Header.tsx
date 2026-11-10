import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router";
import { UserRound, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/context/useAuth";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="w-full border-b border-border bg-background">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          aria-label="Holidaze home"
          className="flex items-center gap-3"
        >
          <img
            src="/images/holidaze-symbol.svg"
            alt=""
            className="h-14 w-14 object-contain"
          />
          <span
            className="text-[32px] font-normal text-heading"
            style={{ fontFamily: '"Lustria", serif' }}
          >
            Holidaze
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden lg:flex items-center gap-6"
        >
          {!user ? (
            <Link to="/login" className="text-foreground hover:text-primary">
              Log in
            </Link>
          ) : (
            <>
              {user.venueManager ? (
                <Link
                  to="/my-venues"
                  className="text-foreground hover:text-primary"
                >
                  My venues
                </Link>
              ) : (
                <Link
                  to="/list-venue"
                  className="text-foreground hover:text-primary"
                >
                  List your venue
                </Link>
              )}

              <Link
                to="/my-bookings"
                className="text-foreground hover:text-primary"
              >
                My bookings
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex cursor-pointer items-center gap-2 text-foreground hover:text-primary"
                  >
                    <UserRound size={20} aria-hidden="true" />
                    <span>Hi, {user.name}</span>
                    <ChevronDown size={16} aria-hidden="true" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
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
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
