import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, Home, LogOut, ArrowLeft } from 'lucide-react';
import logoImg from '@/assets/logo icon.png';
import { useVoting } from '@/contexts/VotingContext';

// Inline logo for the NavBar
const LogoImg = () => (
    <div className="relative flex items-center justify-center bg-transparent w-full h-full">
        <img
            src={logoImg}
            alt="VoxNova 3D Logo Icon"
            className="w-[100%] h-[100%] max-w-none object-contain pointer-events-none drop-shadow-md"
        />
    </div>
);

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, setCurrentUser, setIsAdmin, setIsController } = useVoting();

    // Hide navbar on specialized pages to focus on the task and avoid redundant navigation
    // NavBar is now shown on all pages as requested
    const isSpecialPage = false;
    if (isSpecialPage) return null;

    // Login button only appears on the home page
    const isHome = location.pathname === '/';

    const handleHomeClick = () => {
        if (location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate('/');
        }
    };

    const handleSignout = () => {
        setCurrentUser(null);
        setIsAdmin(false);
        setIsController(false);
        handleHomeClick();
    };

    const handleBack = () => {
        // If we are on a page where the user has completed a process (like /vote success)
        // or if they are in a login loop, take them home instead of back
        if (location.pathname === '/vote' || location.pathname === '/nominate' || location.pathname === '/results') {
            navigate('/');
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="sticky top-0 z-50 bg-[#112250] backdrop-blur-md shadow-[0_1px_10px_rgba(0,0,0,0.1)] border-b border-[#1E4AA8]/20">
            <nav className="container mx-auto px-6 py-3 flex items-center justify-between max-w-7xl relative">
                {/* Left side: Back Button + Brand */}
                <div className="flex items-center gap-0">
                    {!isHome && (
                        <button
                            onClick={handleBack}
                            title="Go Back"
                            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-[#E0C58F] transition-colors -ml-5 mr-3"
                        >
                            <ArrowLeft size={17} />
                        </button>
                    )}

                    {/* Brand & Logo - now logs out and goes home */}
                    <div className={`flex items-center gap-[4px] sm:gap-[6px] cursor-pointer group ${!isHome ? 'ml-0' : ''}`} onClick={handleSignout}>
                        <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 group-hover:scale-105 transition-transform duration-300">
                            <LogoImg />
                        </div>
                        <span className="font-bold text-[20px] sm:text-[26px] tracking-tight ml-0 sm:ml-1 sm:inline">
                            <span className="text-white">Vox</span><span className="text-[#E0C58F]">Nova</span>
                        </span>
                    </div>
                </div>

                {/* Desktop Links — only shown on home page */}
                {isHome && (
                    <div className="hidden md:flex items-center gap-10 text-[15px] font-medium">
                        <a href="/#how-it-works" className="text-white/80 hover:text-[#E0C58F] transition-colors">How It Works</a>
                        <a href="/#about" className="text-white/80 hover:text-[#E0C58F] transition-colors">About</a>
                        <a href="/#contact" className="text-white/80 hover:text-[#E0C58F] transition-colors">Contact</a>
                    </div>
                )}

                {/* Right side: Login + Home on main page, Profile + Signout on inside pages */}
                <div className="flex items-center gap-1 sm:gap-2">
                    {/* Logged in state for specialized pages */}
                    {currentUser && (
                        <>
                            <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-full bg-white/10 border border-[#E0C58F]/30">
                                <div className="h-2 w-2 rounded-full bg-[#E0C58F] animate-pulse hidden xs:block" />
                                <span className="text-[10px] sm:text-sm font-semibold text-white">
                                    {location.pathname === '/vote' ? currentUser.student_id : currentUser.student_id.slice(-4)}
                                </span>
                                <span className="text-[10px] sm:text-xs text-white/70 hidden sm:block">{currentUser.name?.split(' ')[0]}</span>
                            </div>
                            <button
                                onClick={handleSignout}
                                title="Sign out"
                                className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-red-500/20 text-white/80 hover:text-red-400 transition-colors ml-1"
                            >
                                <LogOut size={16} />
                            </button>
                        </>
                    )}

                    {/* Login button shown everywhere if not logged in */}
                    {!currentUser && isHome && (
                        <Button
                            onClick={() => navigate('/login')}
                            className="bg-[#E0C58F] hover:bg-[#d4b57a] text-[#112250] rounded-[2rem] px-3 sm:px-6 py-2 h-[36px] sm:h-[42px] text-xs sm:text-sm font-bold transition-all shadow-[0_4px_12px_rgba(224,197,143,0.25)] hover:shadow-[0_6px_16px_rgba(224,197,143,0.35)] border-none flex items-center gap-2 hover:-translate-y-[1px]"
                        >
                            <User size={16} strokeWidth={2.5} />
                            <span className=" sm:inline">Login</span>
                        </Button>
                    )}

                    {/* Persistent Home Icon */}
                    <button
                        onClick={handleHomeClick}
                        title="Home"
                        className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-[#E0C58F] transition-colors ml-0.5 sm:ml-1"
                    >
                        <Home size={16} />
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default NavBar;
