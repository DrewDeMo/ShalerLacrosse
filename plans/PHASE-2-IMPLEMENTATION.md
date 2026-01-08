# Phase 2: Refactor to Modular Structure

**Current Status**: ✅ Phase 1 Complete - Live at https://shaler-lacrosse.netlify.app/

**Goal**: Separate HTML, CSS, and JavaScript into individual files for better maintainability before React migration.

## Step 1: Create Directory Structure

```bash
# Create folder structure
mkdir css
mkdir js
mkdir assets
```

Your project structure will look like:
```
shaler-lacrosse/
├── css/
│   └── styles.css          (to be created)
├── js/
│   └── script.js           (to be created)
├── assets/                 (for future images/logos)
├── index.html              (to be modified)
├── netlify.toml
├── README.md
└── .gitignore
```

## Step 2: Extract CSS to Separate File

Create `css/styles.css` and move all CSS from the `<style>` tag in [`index.html`](../index.html) (lines 10-911).

The CSS file should start with:
```css
:root {
    --navy: #07174a;
    --red: #c02031;
    --red-glow: rgba(192, 32, 49, 0.4);
    --white: #ffffff;
    --off-white: #f8f9fc;
    --gray: #6b7280;
    --light-gray: #e5e7eb;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* ... rest of CSS ... */
```

## Step 3: Extract JavaScript to Separate File

Create `js/script.js` and move all JavaScript from the `<script>` tag in [`index.html`](../index.html) (lines 1177-1223).

The JS file should contain:
```javascript
// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ... rest of JavaScript ...
```

## Step 4: Update HTML File

Modify [`index.html`](../index.html) to link to external files:

**Replace the `<style>` tag** (lines 10-911) with:
```html
<link rel="stylesheet" href="css/styles.css">
```

**Replace the `<script>` tag** (lines 1177-1223) with:
```html
<script src="js/script.js"></script>
```

Your `<head>` section should look like:
```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shaler Area Titans Lacrosse</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
</head>
```

And before closing `</body>`:
```html
    <script src="js/script.js"></script>
</body>
</html>
```

## Step 5: Test Locally

Open [`index.html`](../index.html) in a browser to verify:
- [ ] All styles load correctly
- [ ] Navigation scroll effect works
- [ ] Smooth scrolling works
- [ ] Animations trigger on scroll
- [ ] No console errors

## Step 6: Commit and Deploy

```bash
git add -A
git commit -m "Phase 2: Refactor to modular structure with separate CSS and JS files"
git push
```

Netlify will automatically redeploy. Verify at https://shaler-lacrosse.netlify.app/

## Verification Checklist

After deployment:
- [ ] Site loads correctly
- [ ] All styles match previous version
- [ ] JavaScript functionality intact
- [ ] No console errors
- [ ] Mobile responsive still works

## Benefits Achieved

✅ **Separation of Concerns**: HTML structure, CSS styles, and JS behavior are now independent  
✅ **Easier Maintenance**: Edit styles without touching HTML  
✅ **Better Caching**: Browser can cache CSS/JS separately  
✅ **Ready for React**: Clean foundation for Phase 3 migration  

---

**Next Phase**: Phase 3 - React + Tailwind Migration
