// demo-app/src/components/ProfileSwitcher.jsx
// A group of 3 radio buttons that switches the accessibility profile.
import { useState, useEffect } from 'react'
import './ProfileSwitcher.css'

// The 3 choices. "value" must match the names used in profiles.css.
const PROFILES = [
  { value: 'default', label: 'Default' },
  { value: 'high-contrast', label: 'High Contrast' },
  { value: 'dyslexia', label: 'Dyslexia-friendly' },
]

function ProfileSwitcher() {
  // State: remembers which profile is chosen. Starts as 'default'.
  const [profile, setProfile] = useState('default')

  // Effect: runs after the first draw and whenever "profile" changes.
  // It writes the profile name onto the <html> tag as data-profile.
  useEffect(() => {
    document.documentElement.setAttribute('data-profile', profile)
  }, [profile])

  return (
    // fieldset + legend groups the radios and gives the group a name.
    <fieldset className="ui-profiles">
      <legend className="ui-profiles__legend">Choose a profile</legend>
      {PROFILES.map((p) => (
        <label key={p.value} className="ui-profiles__option">
          <input
            type="radio"
            name="profile"
            value={p.value}
            checked={profile === p.value}
            onChange={() => setProfile(p.value)}
          />
          {p.label}
        </label>
      ))}
    </fieldset>
  )
}

export default ProfileSwitcher