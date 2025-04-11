import useUser from "@/hooks/useUser";
import Admin from "@/models/admin";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { useEffect, useState } from "react";

export default function SupportEmail() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [supportEmail, setSupportEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");

  useEffect(() => {
    const fetchSupportEmail = async () => {
      const supportEmail = await System.fetchSupportEmail();
      setSupportEmail(supportEmail.email || "");
      setOriginalEmail(supportEmail.email || "");
      setLoading(false);
    };
    fetchSupportEmail();
  }, []);

  const updateSupportEmail = async (e, newValue = null) => {
    e.preventDefault();
    let support_email = newValue;
    if (newValue === null) {
      const form = new FormData(e.target);
      support_email = form.get("supportEmail");
    }

    const { success, error } = await Admin.updateSystemPreferences({
      support_email,
    });

    if (!success) {
      showToast(`Failed to update support email: ${error}`, "error");
      return;
    } else {
      showToast("Successfully updated support email.", "success");
      window.localStorage.removeItem(System.cacheKeys.supportEmail);
      setSupportEmail(support_email);
      setOriginalEmail(support_email);
      setHasChanges(false);
    }
  };

  const handleChange = (e) => {
    setSupportEmail(e.target.value);
    setHasChanges(true);
  };

  if (loading || !user?.role) return null;
  return (
    <form
      className="flex flex-col gap-y-0.5 mt-4"
      onSubmit={updateSupportEmail}
    >
      <h2 className="text-sm leading-6 font-semibold text-white">
        Support Email
      </h2>
      <p className="text-xs text-white/60">
        Set the support email address that shows up in the user menu while
        logged into this instance.
      </p>
      <div className="flex items-center gap-x-4">
        <input
          name="supportEmail"
          type="email"
          className="border-none bg-theme-settings-input-bg mt-2 text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-fit py-2 px-4"
          placeholder="support@mycompany.com"
          required={true}
          autoComplete="off"
          onChange={handleChange}
          value={supportEmail}
        />
        {originalEmail !== "" && (
          <button
            type="button"
            onClick={(e) => updateSupportEmail(e, "")}
            className="text-white text-base font-medium hover:text-opacity-60"
          >
            Clear
          </button>
        )}
      </div>
      {hasChanges && (
        <button
          type="submit"
          className="transition-all mt-2 w-fit duration-300 border border-slate-200 px-5 py-2.5 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
        >
          Save
        </button>
      )}
    </form>
  );
}
