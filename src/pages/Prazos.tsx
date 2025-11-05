import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Prazos = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Prazos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Controle de prazos processuais, contagem e alertas.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Prazos;


