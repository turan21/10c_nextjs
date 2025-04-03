import User from "../models/user";

const UserCard = (user: User) => {
  return (
    <div className="flex items-center justify-between pb-3 pt-3 last:pb-0">
      <div className="flex items-center gap-x-3">
        <img
          src={user.avatar}
          alt="Tania Andrew"
          className="relative inline-block h-9 w-9 rounded-full object-cover object-center"
        />
        <div>
          <h6 className="block font-sans text-base font-semibold leading-relaxed tracking-normal text-blue-gray-900 antialiased">
            {user.first_name} {user.last_name}
          </h6>
          <p className="block font-sans text-sm font-light leading-normal text-gray-700 antialiased">
            {user.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
