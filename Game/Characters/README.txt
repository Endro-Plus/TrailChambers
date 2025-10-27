Ensure that you name the character, then go to js.js and update the character list (charlist). It IS case-sensitive.

Failing to update charlist will cause your character to be skipped over
including a name in the charlist that isn't in a file will result in a major crash!


there are some special damage types:
contact damage has the enemy id included at the end. 
interrupt damage will cause certain enemy attacks to be interrupted. They're mainly softblock or guardbreak attacks, but not limited.
true damage ignores base defense, but not abilities
corrosive damage ignores abilities, but not base defense (unimplemented)
replacehigh damage will replace the hitstun the character is facing with the new value, unless the old value is larger (unimplemented)
replacelow damage will replace the hitstun the character is facing with the new value, unless the old value is smaller (unimplemented)
set damage will replace the hitstun the character is facing with the new value

