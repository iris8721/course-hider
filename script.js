// ==UserScript==
// @name         hides courses
// @namespace    http://tampermonkey.net/
// @description  hides courses
// @author       iris8721
// @include      /^https:\/\/mylearningspace\..+\.ca\/.*/
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    let hideMarked = true;

    const getHiddenCourses = () => JSON.parse(GM_getValue('hiddenCourses', '[]'));
    const setHiddenCourses = (courses) => GM_setValue('hiddenCourses', JSON.stringify(courses));

    function toggleCourseHidden(orgUnitId) {
        const hidden = getHiddenCourses();
        const index = hidden.indexOf(orgUnitId);

        index > -1 ? hidden.splice(index, 1) : hidden.push(orgUnitId);

        setHiddenCourses(hidden);
        updateAllButtons();
        updateCourseVisibility();
    }

    function updateCourseVisibility() {
        const hidden = getHiddenCourses();

        document.querySelectorAll('li.d2l-datalist-item').forEach(item => {
            const courseDiv = item.querySelector('.d2l-course-selector-item');
            if (!courseDiv) return;

            const orgUnitId = courseDiv.getAttribute('data-org-unit-id');
            const isHidden = hidden.includes(orgUnitId);
            item.style.display = (hideMarked && isHidden) ? 'none' : '';
        });

        const dropdown = document.querySelector('d2l-dropdown-content');
        const wrapper = document.querySelector('.d2l-courseselector-wrapper');

        [dropdown, wrapper].forEach(el => {
            if (el) {
                el.style.width = 'auto';
                el.style.minWidth = '450px';
                el.style.maxWidth = '800px';
            }
        });
    }

    function updateAllButtons() {
        const hidden = getHiddenCourses();

        document.querySelectorAll('.custom-hide-btn').forEach(btn => {
            const orgUnitId = btn.getAttribute('data-org-unit-id');
            const isHidden = hidden.includes(orgUnitId);
            btn.textContent = isHidden ? '👁️' : '🚫';
            btn.title = isHidden ? 'Unhide course' : 'Hide course';
        });
    }

    function addHideButtons() {
        const hidden = getHiddenCourses();

        document.querySelectorAll('li.d2l-datalist-item').forEach(item => {
            const courseDiv = item.querySelector('.d2l-course-selector-item');
            if (!courseDiv || courseDiv.querySelector('.custom-hide-btn')) return;

            const orgUnitId = courseDiv.getAttribute('data-org-unit-id');
            const isHidden = hidden.includes(orgUnitId);

            const hideBtn = document.createElement('button');
            hideBtn.className = 'custom-hide-btn';
            hideBtn.setAttribute('data-org-unit-id', orgUnitId);
            hideBtn.textContent = isHidden ? '👁️' : '🚫';
            hideBtn.title = isHidden ? 'Unhide course' : 'Hide course';
            hideBtn.style.cssText = 'margin-left: 0.5rem; padding: 0.25rem 0.5rem; border: 1px solid #ccc; background: #f5f5f5; cursor: pointer; border-radius: 3px;';

            hideBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleCourseHidden(orgUnitId);
            });

            const toggleContainer = courseDiv.querySelector('.d2l-button-toggle-container');
            if (toggleContainer) {
                toggleContainer.parentElement.insertBefore(hideBtn, toggleContainer.nextSibling);
            }
        });
    }

    function addToggleButton() {
        const wrapper = document.querySelector('.d2l-courseselector-wrapper');
        if (!wrapper || document.getElementById('custom-toggle-btn')) return;

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'custom-toggle-btn';
        toggleBtn.textContent = hideMarked ? 'Show All Courses' : 'Show Only Marked';
        toggleBtn.className = 'd2l-button';
        toggleBtn.style.cssText = 'margin: 0.5rem 0.9rem; width: calc(100% - 1.8rem);';

        toggleBtn.addEventListener('click', () => {
            hideMarked = !hideMarked;
            toggleBtn.textContent = hideMarked ? 'Show All Courses' : 'Show Only Marked';
            updateCourseVisibility();
        });

        wrapper.appendChild(toggleBtn);
    }

    function init() {
        addHideButtons();
        updateCourseVisibility();
        addToggleButton();
    }

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', init)
        : init();

    new MutationObserver(init).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
