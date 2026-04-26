import UserInfo from "@/components/root/UserInfo";
import RoomMenu from "@/components/root/RoomMenu";

const Rootpage = () => {
  return (
    <section className="h-screen p-1 gap-1 w-screen overflow-x-hidden flex flex-col md:flex-row items-center justify-center">
      <UserInfo />
      <RoomMenu />
    </section>
  );
};

export default Rootpage;
