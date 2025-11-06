import { Search, ChevronDown, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';
import defaultLogo from '../../assets/logo.png';
import { makeWhiteBackgroundTransparent } from '@/lib/theme';


interface NavbarProps {
  sidebarCollapsed: boolean;
  onToggleSidebar?: () => void;
}

export const Navbar = ({ sidebarCollapsed, onToggleSidebar }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>('Barbosa Pereira Advocacia');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('companySettings');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.companyLogo) setCompanyLogo(parsed.companyLogo as string);
        if (parsed?.companyName) setCompanyName(parsed.companyName as string);
      }
    } catch (_) {
      // ignore
    }
  }, []);

  // Prepare a transparent version of the logo to avoid white background
  const [displayLogo, setDisplayLogo] = useState<string | null>(null);
  useEffect(() => {
    const source = companyLogo || defaultLogo;
    let cancelled = false;
    (async () => {
      const processed = await makeWhiteBackgroundTransparent(source, 245);
      if (!cancelled) setDisplayLogo(processed || source);
    })();
    return () => { cancelled = true; };
  }, [companyLogo]);

  const handleLogout = () => {
    // Simular logout
    toast({
      title: "Logout realizado!",
      description: "Você foi desconectado com sucesso.",
    });
    
    // Redirecionar para a página de login
    navigate('/login');
  };

  // Função para obter o título da página atual
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/atendimentos':
        return 'Atendimento';
      case '/ligacoes-ia':
        return 'Ligações IA';
      case '/ordem-servico':
        return 'Ordem de Serviço';
      case '/relatorios':
        return 'Relatórios';
      case '/configuracao-ia':
        return 'Configuração IA';
      case '/colaboradores':
        return 'Colaboradores';
      case '/configuracoes':
        return 'Configurações';
      default:
        return 'Atendimento';
    }
  };

  return (
    <header className="bg-primary h-16 flex items-center px-4 sm:px-6 relative shadow-sm">
      {/* Gradiente sutil no topo e base */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/10"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-black/10"></div>
      
      <div className="flex items-center w-full">
        {/* Mobile Menu Button */}
        {isMobile && onToggleSidebar && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="text-white hover:bg-white/10 mr-2 p-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Logo e Título - Responsivo */
        }
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="flex items-center">
            <img
              src={displayLogo || defaultLogo}
              alt={companyName}
              className="h-8 sm:h-10 object-contain"
            />
          </div>
          
          <div className="h-6 w-px bg-white/30 hidden sm:block"></div>
          
          <span className="text-white font-medium text-sm sm:text-lg drop-shadow-sm min-w-0 truncate hidden sm:block">
            {getPageTitle()}
          </span>
        </div>

        {/* Barra de Busca - Responsiva */}
        <div className="flex-1 mx-2 sm:mx-4 lg:mx-8 max-w-xs sm:max-w-lg lg:max-w-2xl">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={isMobile ? "Buscar..." : "Buscar atendimentos, clientes ou OS..."}
              className="w-full h-9 sm:h-10 bg-white border-gray-200 rounded-lg pl-3 sm:pl-4 pr-8 sm:pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Seção Direita - Usuário / Ações */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white hover:bg-white/10 px-2 py-1">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-white/20 text-white">CJ</AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col items-start leading-tight">
                    <span className="text-sm text-white">Administrador</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-white/80" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 bg-white/95 backdrop-blur-md border border-border shadow-xl rounded-lg p-1">
              <DropdownMenuItem onClick={() => navigate('/login')}>
                Trocar usuário
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Sair do sistema
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};