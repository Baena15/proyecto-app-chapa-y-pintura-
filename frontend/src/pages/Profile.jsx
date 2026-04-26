import { useAuth } from '../context/AuthContext';

export function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl bg-white p-6 shadow-sm text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl">
          👤
        </div>
        <h1 className="text-lg font-bold text-gray-900">
          {user?.first_name} {user?.last_name}
        </h1>
        <p className="text-sm text-gray-500">{user?.username}</p>
        <span className="mt-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 capitalize">
          {user?.role}
        </span>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="flex justify-between py-2 text-sm">
          <span className="text-gray-500">Email</span>
          <span className="text-gray-900">{user?.email || '-'}</span>
        </div>
        <div className="flex justify-between py-2 text-sm">
          <span className="text-gray-500">Telefono</span>
          <span className="text-gray-900">{user?.phone || '-'}</span>
        </div>
      </div>

      <button
        onClick={logout}
        className="rounded-xl bg-red-50 py-3 text-sm font-semibold text-red-600 active:bg-red-100"
      >
        Cerrar sesion
      </button>
    </div>
  );
}
