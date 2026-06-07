import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardHome() {
	const { user } = useAuth();

	return (
		<div style={{ display: 'grid', gap: 16 }}>
			<div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 16, padding: '28px 32px' }}>
				<div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>Dashboard</div>
				<h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>
					Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
				</h1>
				<p style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>
					Use the dashboard tabs to manage your profile, browse members, and submit or review events.
				</p>
			</div>

			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
				{[
					{ label: 'Browse members', to: '/dashboard/members' },
					{ label: 'Edit profile', to: '/dashboard/profile' },
					{ label: 'Submit event', to: '/dashboard/submit' },
					{ label: 'View events', to: '/dashboard/events' },
				].map((item) => (
					<Link key={item.label} to={item.to} style={{
						background: '#fff', border: '1px solid #ebebeb', borderRadius: 14,
						padding: '18px 20px', color: '#1a1a1a', textDecoration: 'none', fontSize: 14, fontWeight: 600,
					}}>
						{item.label}
					</Link>
				))}
			</div>
		</div>
	);
}
