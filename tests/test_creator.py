n = int(input("Banyak node: "))
names = []
for i in range(n):
    names.append(input(f"Node {i+1}: "))

is_directed = input("Apakah graph directed? (Y/n)") != "n"

adj_mat = [["0" for _ in range(n)] for _ in range(n)]

while True:
    try:
        for i, name in enumerate(names):
            print(f"{i}. {name}")
        start = input("Pilih node yang akan dijadikan asal edge (kosong jika selesai): ")
        if start == "":
            break
        start = int(start)
        end = input("Pilih node yang akan dijadikan tujuan edge (kosong jika selesai): ")
        if end == "":
            break
        end = int(end)
        weight = input("Masukkan weight dari edge: ")
        adj_mat[start][end] = weight
        if not is_directed:
            adj_mat[end][start] = weight
    except:
        continue


filename = input("File output: ")
with open(filename, "w") as f:
    f.write(str(n))
    f.write("\n")
    f.write("\n".join(names))
    f.write("\n")
    for line in adj_mat:
        f.write(" ".join(line))
        f.write("\n")

        