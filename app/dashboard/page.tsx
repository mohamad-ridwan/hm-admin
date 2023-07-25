import Template from "app/template";
import { Container } from "components/Container";
import { OverView } from "./OverView";

export default function DashboardPage() {
  return (
    <Template
      key={0}
      title="Hospice Medical Admin"
      description="dashboard hospice medical admin"
    >
      <Container
        overflow="overflow-x-auto"
        title="Overview"
      >
        <OverView/>
      </Container>
    </Template>
  )
}