#aplicación de calculadora compleja con python con interfaz grafica
import tkinter as tk
from tkinter import ttk
import math

class CalculadoraCompleja:
    def __init__(self, root):
        self.root = root
        self.root.title("Calculadora Compleja")
        
        # Variables para almacenar números complejos
        self.real1 = tk.StringVar()
        self.imag1 = tk.StringVar()
        self.real2 = tk.StringVar()
        self.imag2 = tk.StringVar()
        
        # Crear widgets
        self.crear_widgets()

    def crear_widgets(self):
        # Frame principal
        main_frame = ttk.Frame(self.root, padding="10")
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))
        
        # Entradas para el primer número complejo
        ttk.Label(main_frame, text="Primer número complejo:").grid(row=0, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=5)
        ttk.Label(main_frame, text="Real:").grid(row=1, column=0, sticky=tk.W, pady=2)
        ttk.Entry(main_frame, textvariable=self.real1, width=10).grid(row=1, column=1, sticky=(tk.W, tk.E), padx=5)

        ttk.Label(main_frame, text="Imaginario:").grid(row=2, column=0, sticky =tk.W, pady=2)
        ttk.Entry(main_frame, textvariable=self.imag1, width=10).grid(row=2, column=1, sticky=(tk.W, tk.E), padx=5)

        # Entradas para el segundo número complejo
        ttk.Label(main_frame, text="Segundo número complejo:").grid(row=3, column=0, columnspan=2, sticky=(tk.W, tk.E), pady=5)
        ttk.Label(main_frame, text="Real:").grid(row=4, column=0, sticky=tk.W, pady=2)
        ttk.Entry(main_frame , textvariable=self.real2, width=10).grid(row=4, column=1, sticky=(tk.W, tk.E), padx=5)

        ttk.Label(main_frame, text="Imaginario:").grid(row=5, column=0, sticky=tk.W, pady=2)
        ttk.Entry(main_frame, textvariable=self.imag2, width=10).grid(row=5, column=1, sticky=(tk.W, tk.E), padx=5)

        # Botones de operaciones
        ttk.Button(main_frame, text="Sumar", command=self.sumar).grid(row=6, column=0, sticky=(tk.W, tk.E), pady=5)
        ttk.Button(main_frame, text="Restar", command=self.restar).grid(row=6, column=1, sticky=(tk.W, tk.E), pady=5)
        ttk.Button(main_frame, text="Multiplicar", command=self.multiplicar).grid(row=7, column=0 , sticky=(tk.W, tk.E), pady=5)
        ttk.Button(main_frame, text="Dividir", command=self.dividir).grid(row=7, column=1, sticky=(tk.W, tk.E), pady=5)
        ttk.Button(main_frame, text="Conjugado", command=self.conjugado).grid(row=8, column=0, sticky=(tk.W, tk.E), pady=5)
        ttk.Button(main_frame, text="Módulo", command=self.modulo).grid(row=8, column=1, sticky=(tk.W, tk.E), pady=5)
        ttk.Button(main_frame, text="F ase a Grados", command=self.fase_a_grados).grid(row=9, column=0, sticky=(tk.W, tk.E), pady=5)
        ttk.Button(main_frame, text="Fase a Radianes", command=self.fase_a_radianes).grid(row=9, column=1, sticky=(tk.W, tk.E), pady=5)
        # Resultado
        self.resultado = tk.StringVar()
        ttk.Label(main_frame, text="Resultado:").grid(row=10, column=0, sticky=tk.W, pady=5)
        ttk.Label(main_frame, textvariable=self.resultado).grid(row=10, column=1, sticky=(tk.W, tk.E))
        
        # Configurar el peso de las columnas
        main_frame.columnconfigure(0, weight=1)
        main_frame.columnconfigure(1, weight=1)
        main_frame.rowconfigure(0, weight=1)
        main_frame.rowconfigure(1, weight=1)
        main_frame.rowconfigure(2, weight=1)
        main_frame.rowconfigure(3, weight=1)
        main_frame.rowconfigure(4, weight=1)
        main_frame.rowconfigure(5, weight=1)
        main_frame.rowconfigure(6, weight=1)
        main_frame.rowconfigure(7, weight=1)
        main_frame.rowconfigure(8, weight=1)
        main_frame.rowconfigure(9, weight=1)
        main_frame.rowconfigure(10, weight=1)
        
        # Métodos de operaciones
    def sumar(self):
        try:
            z1 = complex(float(self.real1.get()), float(self.imag1.get()))
            z2 = complex(float(self.real2.get()), float(self.imag2.get()))
            resultado = z1 + z2
            self.resultado.set(f"{resultado.real:.2f} + { resultado.imag:.2f}i")
        except ValueError:
            self.resultado.set("Error: Entrada inválida")
    
    def restar(self):
        try:
            z1 = complex(float(self.real1.get()), float(self.imag1.get()))
            z2 = complex(float(self.real2.get()), float(self.imag2.get()))
            resultado = z1 - z2
            self.resultado.set(f"{resultado.real:.2f} + {resultado.imag:.2f}i")
        except ValueError:
            self.resultado.set("Error: Entrada inválida")
    
    def multiplicar(self):
        try:
            z1 = complex(float(self.real1.get()), float(self.imag1.get()))
            z2 = complex(float(self.real2.get()), float(self.imag2.get()))
            resultado = z1 * z2 
            self.resultado.set(f"{resultado.real:.2f} + {resultado.imag:.2f}i")
        except ValueError:
            self.resultado.set("Error: Entrada inválida")
    
    def dividir(self):
        try:
            z1 = complex(float(self.real1.get()), float(self.imag1.get()))
            z2 = complex(float(self.real2.get()), float(self.imag2.get()))
            resultado = z1 / z2
            self.resultado.set(f"{resultado.real:.2f} + {resultado.imag:.2f}i")
            
        except ZeroDivisionError:
            self.resultado.set("Error: División por cero")
    
    def conjugado(self):
        try:
            z1 = complex(float(self.real1.get()), float(self.imag1.get()))
            resultado = z1.conjugate()
            self.resultado.set(f"{resultado.real:.2f} + {resultado.imag:.2f}i")
        except ValueError:
            self.resultado.set("Error: Entrada inválida")
            
    def modulo(self):
        try:
            z1 = complex(float(self.real1.get()), float(self.imag1.get()))
            resultado = abs(z1)
            self.resultado.set(f"{resultado:.2f}")
        except ValueError:
            self.resultado.set("Error: Entrada inválida")      

