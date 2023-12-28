import CustomerData from "../../../Components/CustomerData";

export async function generateStaticParams() {
  const posts = await fetch(
    "https://backend-online.onrender.com/getDynamicRoutesOfUserName",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  ).then((res) => res.json());

  return posts.data.userNames;
}

export default function Page({ params }) {
  return (
    <div className="h-full w-full">
      <CustomerData params={params} />
    </div>
  );
}
