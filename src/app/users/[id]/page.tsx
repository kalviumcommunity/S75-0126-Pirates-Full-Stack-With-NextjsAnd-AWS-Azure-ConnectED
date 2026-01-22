interface Props {
  params: { id: string };
}

export default function UserProfile({ params }: Props) {
  return (
    <main className="flex flex-col items-center mt-10">
      <h2 className="text-xl font-bold">User Profile</h2>
      <p>User ID: {params.id}</p>
    </main>
  );
}
