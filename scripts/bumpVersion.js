/**
 * TODO: add logic to bump versions in package.json files:
 * Version number format: major.minor.path-(alpha|beta).build
 * bump with 'major' = bump major, set minor and patch to 0 and remove any alpha/beta versions
 * bump with 'minor' = bump minor, set patch to 0 and remove any alpha/beta versions
 * bump with 'patch' = bump path and remove any alpha/beta versions
 * bump with 'alpha' = don't touch major, minor, patch; if '-beta.x'is preseent, remove it; if not present, add '-alpha.1', otherwise bump alpha build version
 * bump with 'beta' = don't touch major, minor, patch; if '-alpha.x'is preseent, remove it; if not present, add '-beta.1', otherwise bump beta build version
 */
