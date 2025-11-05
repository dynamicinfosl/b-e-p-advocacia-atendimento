import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Documentos = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Documentos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Repositório de peças, petições e contratos com modelos.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Documentos;


