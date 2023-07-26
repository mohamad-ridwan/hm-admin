import Template from "app/template";
import { Container } from "components/Container";
import { OverView } from "./OverView";
import { FinishedTreatment } from "./FinishedTreatment";
import { PaymentInfo } from "./PaymentInfo";

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
        <OverView />
        <Container
          isNavleft={false}
          overflow="overflow-x-hidden"
          title="Finished Treatment"
          maxWidth="auto w-full"
        >
          <FinishedTreatment />
        </Container>
        <Container
          isNavleft={false}
          overflow="overflow-x-hidden"
          title="Payment Information"
          maxWidth="auto w-full"
        >
          <PaymentInfo />
        </Container>
      </Container>
    </Template>
  )
}