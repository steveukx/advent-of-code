import { readInputFrom, toStringArray } from '../__fixtures__';

describe('07', function () {
    class File {
        constructor(public readonly name: string, public readonly size: number) {
        }
    }

    class Directory {
        private children: Map<string, Directory | File> = new Map();
        private _size = 0;

        constructor(public readonly name: string, private readonly parent?: Directory) {
        }

        public get path(): string {
            return `${this.parent?.path || ''}/${this.name}`.substring(1);
        }

        public get size(): number {
            this._size = this._size || Array.from(this.children.values()).reduce((count, child) => count + child.size, 0);
            return this._size;
        }

        public get root(): Directory {
            return this.parent?.root || this;
        }

        public cd(to: string): Directory {
            switch (to) {
                case '..':
                    return this.parent || this;
                case '/':
                    return this.root;
                default:
                    const dir = this.children.get(to);
                    if (dir instanceof Directory) {
                        return dir;
                    }
                    throw new Error(`CD to directory that doesn't exist: ${this.path}/${to}`);
            }
        }

        public ls<T extends Directory | File>(child: T): T {
            this._size = 0;
            this.children.set(child.name, child);
            return child;
        }
    }

    function parse(input: string) {
        const commands = toStringArray(input);
        let dir = new Directory('/');
        const directories = new Set<Directory>([dir]);

        function parseInput(cmd: string) {
            if (cmd === 'ls') {
                return;
            }
            if (cmd.startsWith('cd ')) {
                return dir = dir.cd(cmd.substring(3));
            }

            throw new Error('Unknown command input: ' + input);
        }

        function parseOutput(out: string) {
            const [, info, name] = out.match(/^(\S+) (.+)$/) || [, '0', ''];

            if (info === 'dir') {
                directories.add(
                    dir.ls(new Directory(name, dir))
                );
            } else {
                dir.ls(new File(name, parseInt(info, 10)));
            }
        }

        commands.forEach((command) => {
            (command.charAt(0) === '$')
                ? parseInput(command.substring(2))
                : parseOutput(command);
        });

        return Array.from(directories);
    }

    it('ex0', () => {
        const d = parse(`
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`);

        d.forEach(d => console.log(`${d.path}: ${d.size}`));
    });

    it('q1', () => {
        const dirs = parse(readInputFrom(2022, 7, 'input'));
        const sum = dirs.reduce(
            (count, {size}) => size > 100000 ? count : count + size, 0
        );

        console.log(sum);
    });

    it('q2', () => {
        const dirs = parse(readInputFrom(2022, 7, 'input'));
        const toFreeUp = 30000000 - (70000000 - dirs[0].size);

        const closest = Array.from(dirs).reduce(
            (c, d) => (d.size < c.size && d.size > toFreeUp) ? d : c
        );

        console.log(closest.size);
    })
});