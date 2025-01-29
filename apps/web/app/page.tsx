import { Card } from "@repo/ui/card";
import { greet } from "@repo/utils/messages";

export default function Home() {
  return (
    <>
      <div className="p-2">{greet("world")}</div>
      <Card title="Card" href="/">
        This is a test card
      </Card>
    </>
  );
}
