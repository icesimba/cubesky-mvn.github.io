var $$ = mdui.JQ;
var copyDialog = new mdui.Dialog('#copy-dialog', {});
const template = `
    <tr>
      <td>{group}</td>
      <td>{name}</td>
      <td>
        <select class="mdui-select" mdui-select data-lid="{lid}" data-name="{vname}" data-group="{vgroup}">
          {versions}
        </select>
      </td>
      <td>{description}</td>
      <td><a target="_black" href="{url}" mdui-tooltip="{ content:'Go to Home Page', delay: 600 }">{source}<i class="mdui-icon material-icons mdui-text-color-black-icon">open_in_new</i></a></td>
      <td><a target="_black" href="{license-url}" mdui-tooltip="{ content:'{license-fullname}', delay: 600 }">{license-name}<i class="mdui-icon material-icons mdui-text-color-black-icon">open_in_new</i></a></td>
      <td><button class="btncopy mdui-btn mdui-btn-icon" mdui-tooltip="{ content:'Copy Maven Dependency', delay: 600 }" data-clipboard-action="copy" data-clipboard-text="{maven}" id="lib-maven-{mlid}"><i class="mdui-icon material-icons">content_copy</i></button></td>
      <td><button class="btncopy mdui-btn mdui-btn-icon" mdui-tooltip="{ content:'Copy Gradle Dependency', delay: 600 }" data-clipboard-action="copy" data-clipboard-text="{gradle}" id="lib-gradle-{glid}"><i class="mdui-icon material-icons">content_copy</i></button></td>
    </tr>
    `;
const template_version = `<option {def}>{version}</option>`;
const template_maven = `
<dependency>
  <groupId>{group}</groupId>
  <artifactId>{name}</artifactId>
  <version>{version}</version>
</dependency>
`;
const template_gradle = `compile group: '{group}', name: '{name}', version: '{version}'`;
const maven_repo = `
<repository>
  <id>cubesky-mvn</id>
  <name>CubeSkyMVN</name>
  <url>https://cubesky-mvn.github.io</url>
</repository>
`;
const gradle_repo = `
maven {
  url 'https://cubesky-mvn.github.io'
}
`;
const dataStore = [{
    group: 'party.liyin',
    name: 'socketchannel',
    url: 'https://github.com/cubesky/SocketChannel',
    description: 'Easy TCP/UDP transport',
    source: 'Github',
    license: { name: 'GPLv3', url: 'https://www.gnu.org/licenses/gpl-3.0.en.html#content', fullname: 'The GNU General Public License v3.0' },
    version: ['1.0', '2.0', '2.1']
}];
$$('#maven-install')[0].setAttribute('data-clipboard-text', maven_repo);
$$('#gradle-install')[0].setAttribute('data-clipboard-text', gradle_repo);
for (var i = 0; i < dataStore.length; i++) {
    var data = dataStore[i];
    var version = '';
    var latest = '';
    for (var iv = data.version.length - 1; iv >= 0; iv--) {
        var ver = data.version[iv];
        var def = '';
        if (i == data.version.length - 1) {
            def = 'selected';
            latest = ver;
        }
        version += template_version.replace('{version}', ver).replace('{def}', def);
    }
    var gradle = template_gradle.replace('{group}', data.group).replace('{name}', data.name).replace('{version}', latest);
    var maven = template_maven.replace('{group}', data.group).replace('{name}', data.name).replace('{version}', latest);
    $$('#library-list')[0].innerHTML += (template.replace('{versions}', version).replace('{url}', data.url).replace('{group}', data.group).replace('{vgroup}', data.group).replace('{name}', data.name).replace('{vname}', data.name).replace('{description}', data.description).replace('{license-name}', data.license.name).replace('{license-url}', data.license.url).replace('{license-fullname}', data.license.fullname).replace('{source}', data.source).replace('{gradle}', gradle).replace('{maven}', maven).replace('{lid}', i).replace('{glid}', i).replace('{mlid}', i));
}
$$('.mdui-select').on('closed.mdui.select', function(target) {
    var lid = target.target.dataset.lid;
    var name = target.target.dataset.name;
    var group = target.target.dataset.group;
    var version = target.target.value;
    var gradle = template_gradle.replace('{group}', group).replace('{name}', name).replace('{version}', version);
    var maven = template_maven.replace('{group}', group).replace('{name}', name).replace('{version}', version);
    $$('#lib-gradle-' + lid)[0].setAttribute('data-clipboard-text', gradle);
    $$('#lib-maven-' + lid)[0].setAttribute('data-clipboard-text', maven);
});

function copyManually(data) {
    $$('#manual-copy').val(data);
    copyDialog.open();
}

function copyManuallyClose() {
    copyDialog.close();
}

function toTop() {
  window.scroll({
    top: 0, 
    left: 0, 
    behavior: 'smooth' 
  });
}

var clipboard = new Clipboard('.btncopy');
clipboard.on('success', function(e) {
    mdui.snackbar({
        message: 'Copied',
        position: 'right-top',
        timeout: 2500
    });
    e.clearSelection();
});
clipboard.on('error', function(e) {
    mdui.snackbar({
        message: 'Can not copy on your browser',
        position: 'right-top',
        timeout: 2500
    });
    copyManually(e.trigger.dataset.clipboardText);
});

window.addEventListener('scroll', function(e) {
  if (window.scrollY < 50) {
    $$('#back-to-top').addClass('mdui-fab-hide');
  } else {
    $$('#back-to-top').removeClass('mdui-fab-hide');
  }
});