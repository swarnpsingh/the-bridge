import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardHome() {
	const { user } = useAuth();

	return (
		<div style={{ display: 'grid', gap: 16 }}>
			<div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: '28px 32px', boxShadow: 'var(--shadow)' }}>
				<div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>Dashboard</div>
				<h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-strong)', marginBottom: 8 }}>
					Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
				</h1>
				<p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
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
						background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18,
						padding: '18px 20px', color: 'var(--text-strong)', textDecoration: 'none', fontSize: 14, fontWeight: 700,
						boxShadow: 'var(--shadow-soft)',
					}}>
						{item.label}
					</Link>
				))}
			</div>
		</div>
	);
}
