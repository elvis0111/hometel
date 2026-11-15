import { getHotelsForModeration } from "@/actions/getHotelsForModeration";
import ModerationList from "@/components/admin/ModerationList";
import { isAdmin } from "@/lib/admin";
import { getPublicProfiles } from "@/lib/users";

/** Super admin dashboard: validate or reject the hotels submitted by users. */
const AdminPage = async () => {
    if (!isAdmin()) return <div>Access denied...</div>

    const { pending, approved, rejected } = await getHotelsForModeration()
    const authors = await getPublicProfiles([...pending, ...approved, ...rejected].map((h) => h.userId))

    return (<div className="flex flex-col gap-10 py-4">
        <div>
            <h2 className="text-2xl font-semibold">Admin · Hotel moderation</h2>
            <p className="text-primary/70">New hotels only appear on the home page once you approve them.</p>
        </div>
        <ModerationList title={`Pending review (${pending.length})`} hotels={pending} authors={authors} emptyText="Nothing to review 🎉" />
        <ModerationList title={`Rejected (${rejected.length})`} hotels={rejected} authors={authors} emptyText="No rejected hotels." />
        <ModerationList title={`Approved (${approved.length})`} hotels={approved} authors={authors} emptyText="No approved hotels yet." />
    </div>);
}

export default AdminPage;
