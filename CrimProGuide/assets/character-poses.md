# Character Pose Placeholders

This file documents the naming conventions and purposes for the various poses of each mascot character in the CrimProGuide.

## Pose Types

Each character has three standard poses:

1. **Default/Main Pose** - The standard explanatory pose (already created)
2. **Confused/Questioning Pose** - For FAQs and addressing common misconceptions
3. **Action Pose** - A role-specific pose that demonstrates the character's primary function

## File Naming Convention

Files should follow this naming pattern:
- Main pose: `[character-name].png` (e.g., `felipe.png`)
- Confused pose: `[character-name]-confused.png` (e.g., `felipe-confused.png`)
- Action pose: `[character-name]-action.png` (e.g., `felipe-action.png`)

## Character-Specific Action Poses

### Felipe the Fourth Amendment Fox
- **Action Pose:** Actively investigating with magnifying glass or protecting a house (representing protection of privacy)
- Filename: `felipe-action.png`

### Miguel the Miranda Macaw
- **Action Pose:** Reading rights from a scroll with emphasis/pointing wing (representing warning/informing of rights)
- Filename: `miguel-action.png`

### Etana the Exclusionary Rule Elephant
- **Action Pose:** Actively blocking/filtering evidence (more dynamic version of blocking gesture)
- Filename: `etana-action.png`

### Waru the Warrant Exception Quokka
- **Action Pose:** Discovering an alternative path or finding a key for a special door (representing finding exceptions)
- Filename: `waru-action.png`

### Tulio the Terry Stop Tapir
- **Action Pose:** Conducting a pat-down or timing a brief stop with hourglass (representing the temporary nature of Terry stops)
- Filename: `tulio-action.png`

## Usage in HTML

Use the following classes to incorporate the different poses in the HTML:

```html
<!-- Default pose -->
<img src="../assets/felipe.png" alt="Felipe the Fourth Amendment Fox" class="character-default">

<!-- Confused pose -->
<img src="../assets/felipe-confused.png" alt="Felipe the Fourth Amendment Fox confused" class="character-confused">

<!-- Action pose -->
<img src="../assets/felipe-action.png" alt="Felipe the Fourth Amendment Fox in action" class="character-action">
```

These classes have corresponding styling in the CSS to ensure proper display and integration with the content.
