import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Processos = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Processos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Acompanhe ações, fases processuais, publicações e movimentações.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Processos;


