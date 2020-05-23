def fix_codec_error(func):
    """
    In non-English operating systems (such as Chinese), the cmd may return some charactors
    that is not included in ANSI. We change the chcp before running script to avoid decode
    errors.
    """
    def wrapper(*args, **kwargs):
        import os
        os.system("chcp 65001")
        return func(*args, **kwargs)
    return wrapper

@ fix_codec_error
def build():
    import PyInstaller.__main__
    import os.path
    # === CONSTANTS ===
    PROJECT_ROOT = os.path.abspath('..')
    PY_CODE_ROOT = os.path.abspath('.')
    PY_SRC = os.path.abspath('./src/')

    # === CONFIGURATIONS ===
    entrance = os.path.join(PY_SRC, '__main__.py')
    package_name = 'ElectronPythonSubProcess'
    distpath = os.path.join(PROJECT_ROOT, 'public')
    hook_dir = os.path.join(PY_SRC, 'hooks')
    data = ''
    binary = ''

    # === RUN INSTALLER ===
    scripts = []
    if package_name:
        scripts.append('--name={name}'.format(name=package_name)),
    if distpath:
        scripts.append('--distpath={distpath}'.format(distpath=distpath)),
    if hook_dir:
        scripts.append('--additional-hooks-dir={hook_dir}'.format(hook_dir=hook_dir))
    if data:
        scripts.append('--add-data={data}'.format(data=data))
    if binary:
        scripts.append('--add-binary={binary}'.format(binary=binary))
    scripts.append(entrance)

    PyInstaller.__main__.run(scripts)
