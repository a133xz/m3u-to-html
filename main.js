const main = document.getElementById('main');
const status = document.getElementById('status');
const select = document.getElementById('select');
const loader = document.getElementById('loader');
const listDiv = document.getElementById('list');
const input = document.getElementById('search-input');

loader.style.display = 'none';
main.style.display = 'none';

// Possible external variables
const splitBy = 'EXTINF:-1';
const keysToParse = { name: 'tvg-name', group: 'group-title' };

// Get group of values
const getValuesByKey = (string, key) => {
  const regx = new RegExp(`${key}="(.*?)"`);
  const value = string.match(regx);
  if (value && value.length) {
    return value[1];
  }
  return '';
};
// Get Link
const getLink = (string) => {
  const regx = /http[s]*:\/\/[^\/]+(\/.+)/;
  const value = string.match(regx);
  if (value && value.length) {
    return value[0];
  }
  return '';
};
// Copy URL
async function copy_url(url) {
  try {
    await navigator.clipboard.writeText(url);
    console.log('Text or Page URL copied');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}
// The constructor
function Channel(name, group, link) {
  this.name = name;
  this.group = group;
  this.link = link;
}

if (window.FileList && window.File && window.FileReader) {
  document.getElementById('file-selector').addEventListener('change', (event) => {
    status.textContent = '';
    loader.style.display = 'block';
    const obj = [];
    const filters = new Set();
    const file = event.target.files[0];
    if (!file.type) {
      status.textContent = 'Error: The File.type property does not appear to be supported on this browser.';
      return;
    }
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = function (evt) {
      const results = evt.target.result;
      results.split(splitBy).map(function (channel) {
        const name = getValuesByKey(channel, keysToParse.name);
        const group = getValuesByKey(channel, keysToParse.group);
        const link = getLink(channel);
        if (link) {
          return obj.push(new Channel(name, group, link));
        }
        return [];
      });
      const ul = document.createElement('ul');
      for (let i = 0; i < obj.length; ++i) {
        const anchor = document.createElement('a');
        const li = document.createElement('li');
        anchor.href = obj[i].link;
        anchor.textContent = obj[i].name;
        li.appendChild(anchor);
        li.insertAdjacentHTML(
          'beforeend',
          `<button class="btn mr-2" type="button" aria-label="Copy icon" onclick="copy_url('${obj[i].link}')">
        <svg aria-hidden="true" role="img" class="octicon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="display: inline-block; user-select: none; vertical-align: text-bottom;"><path fill-rule="evenodd" d="M5.75 1a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-3a.75.75 0 00-.75-.75h-4.5zm.75 3V2.5h3V4h-3zm-2.874-.467a.75.75 0 00-.752-1.298A1.75 1.75 0 002 3.75v9.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-9.5a1.75 1.75 0 00-.874-1.515.75.75 0 10-.752 1.298.25.25 0 01.126.217v9.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-9.5a.25.25 0 01.126-.217z"></path></svg>
      </button>`
        );
        li.setAttribute('group', obj[i].group);
        li.classList.add('Box-row');
        filters.add(obj[i].group);
        ul.appendChild(li);
        ul.id = 'list-items';
      }
      listDiv.appendChild(ul);
      const filtersArr = Array.from(filters);
      for (let i = 0; i < filtersArr.length; i++) {
        var opt = filtersArr[i];
        var el = document.createElement('option');
        el.textContent = opt;
        el.value = opt;
        select.appendChild(el);
      }
      loader.style.display = 'none';
      main.style.display = 'block';
    };
    reader.onerror = function (evt) {
      status.textContent = 'error reading file';
    };
  });
}

// Events from HTML
function filterItems(select) {
  const divSelect = select.value;
  const ul = document.getElementById('list-items');
  const li = ul.getElementsByTagName('li');
  for (let i = 0; i < li.length; i++) {
    let nodeValue = li[i].attributes.group.nodeValue;
    if (divSelect === 'all') {
      li[i].style.display = '';
    } else {
      if (divSelect == nodeValue) {
        li[i].style.display = '';
      } else {
        li[i].style.display = 'none';
      }
    }
  }
}

function search() {
  const filter = input.value.toUpperCase();
  const ul = document.getElementById('list-items');
  const li = ul.getElementsByTagName('li');
  for (let i = 0; i < li.length; i++) {
    let item = li[i].getElementsByTagName('a')[0];
    let textValue = item.textContent || item.innerText;
    if (textValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = '';
    } else {
      li[i].style.display = 'none';
    }
  }
}
