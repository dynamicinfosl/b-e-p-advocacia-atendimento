import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Clientes = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Cadastre e gerencie clientes, partes e contatos do escritório.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Clientes;


