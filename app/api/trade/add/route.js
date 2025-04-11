import dbConnect from "@/lib/dbConnect";
import Trade from "@/app/models/Trade";

export async function POST(req) {
  try {
    console.log("api request sent");
    await dbConnect();
    const data = await req.json();

    console.log("connected to db");

    if (!data.action || !data.price) {
      return new Response(JSON.stringify({ success: false, error: "Invalid trade data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newTrade = await Trade.create(data);
        console.log("Successfully saved");
    return new Response(JSON.stringify({ success: true, trade: newTrade }), {
      status: 201,  // ✅ 201 means resource created
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ API Error:", err);
    return new Response(JSON.stringify({ success: false, error: "Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const trades = await Trade.find().sort({ createdAt: -1 });

    return new Response(JSON.stringify({ success: true, trades }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ API Error:", err);
    return new Response(JSON.stringify({ success: false, error: "Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
