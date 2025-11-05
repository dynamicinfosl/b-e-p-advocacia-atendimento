import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Audiencias = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Audiências</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Agenda e controle de audiências, intimações e atas.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Audiencias;


