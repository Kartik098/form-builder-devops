import React, { useState } from "react";
import { nanoid } from "nanoid";
import { useAuth } from "../../hooks/useAuth";

const fieldTypes = [
  { label: "Short Answer", type: "short" },
  { label: "Email", type: "email" },
  { label: "Number", type: "number" },
  { label: "Long Answer", type: "long" },
  { label: "Dropdown", type: "dropdown" },
  { label: "Multiple Choice", type: "radio" },
  { label: "Checkbox", type: "checkbox" },
  { label: "Date", type: "date" },
  { label: "Time", type: "time" },
  { label: "Range", type: "range" },
];

const FormBuilder = () => {
  useAuth()
  const [fields, setFields] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [formData, setFormData] = useState<{ [key: string]: any }>({});

  const addField = (type: string) => {
    setFields((prev) => [
      ...prev,
      {
        id: nanoid(),
        type,
        label: "Question",
        required: false,
        options: ["Option 1", "Option 2"],
        min: "",
        max: ""
      },
    ]);
  };

  const updateField = (id: string, updates: any) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const deleteField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const moveField = (id: string, dir: "up" | "down") => {
    const idx = fields.findIndex((f) => f.id === id);
    if (dir === "up" && idx > 0) {
      const newFields = [...fields];
      [newFields[idx - 1], newFields[idx]] = [newFields[idx], newFields[idx - 1]];
      setFields(newFields);
    } else if (dir === "down" && idx < fields.length - 1) {
      const newFields = [...fields];
      [newFields[idx + 1], newFields[idx]] = [newFields[idx], newFields[idx + 1]];
      setFields(newFields);
    }
  };

  const handleChange = (id: string, value: any) => {
  const updated = {
    ...formData,
    [id]: value
  };
  debugger
  console.log(`Updating formData[${id}]:`, value);
  console.log("Current formData:", updated);
  setFormData(updated);
};

 const handleSubmit = async () => {
  const payload = {
    title,
    fields
  };

  try {
    const response = await fetch('http://localhost:5000/api/forms/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      alert('Form schema saved successfully!');
    } else {
      alert('Failed to save form schema');
    }
  } catch (err) {
    console.error(err);
    alert('An error occurred.');
  }
};


  return (
    <div className="flex h-screen p-4 gap-4">
      {/* Left palette */}
      <div className="w-1/4 border rounded p-4 bg-white shadow">
        <h2 className="font-bold text-lg mb-2">Form Field</h2>
        {fieldTypes.map((item) => (
          <div
            key={item.type}
            className="flex justify-between items-center bg-gray-100 hover:bg-gray-200 p-2 mb-2 rounded cursor-pointer"
            onClick={() => addField(item.type)}
          >
            <span>{item.label}</span>
            <button className="bg-gray-300 rounded px-2">+</button>
          </div>
        ))}
      </div>

      {/* Right form area */}
      <div className="w-3/4 flex flex-col gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Form Title"
          className="border p-2 rounded text-xl font-semibold"
        />

        {fields.map((field, index) => (
          <div key={field.id} className="border rounded p-4 bg-white shadow">
            <div className="flex justify-between items-center">
              <div className="font-semibold text-lg">
                Question {index + 1} ({fieldTypes.find(f => f.type === field.type)?.label})
              </div>
              <div className="flex gap-2">
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                  />
                  Required
                </label>
                <select
                  className="border px-2 py-1"
                  value={field.type}
                  onChange={(e) => updateField(field.id, { type: e.target.value })}
                >
                  {fieldTypes.map(ft => (
                    <option key={ft.type} value={ft.type}>{ft.label}</option>
                  ))}
                </select>
                <button onClick={() => moveField(field.id, "up")}>↑</button>
                <button onClick={() => moveField(field.id, "down")}>↓</button>
                <button onClick={() => deleteField(field.id)} className="text-red-600">✕</button>
              </div>
            </div>

            <input
              type="text"
              value={field.label}
              onChange={(e) => updateField(field.id, { label: e.target.value })}
              placeholder="Question"
              className="border p-2 mt-2 mb-2 w-full rounded"
            />

            {/* Type-specific input preview */}
            {field.type === "short" || field.type === "email" || field.type === "number" ? (
              <input
                type={field.type === "short" ? "text" : field.type}
                placeholder={field.label}
                className="border p-2 w-full"
                onChange={(e) => handleChange(field.id, e.target.value)}
                value={formData[field.id] || ''}
              />
            ) : field.type === "long" ? (
              <textarea
                className="border p-2 w-full"
                placeholder={field.label}
                rows={4}
                onChange={(e) => handleChange(field.id, e.target.value)}
                value={formData[field.id] || ''}
              />
            ) : field.type === "dropdown" ? (
              <select
                className="border p-2 w-full"
                onChange={(e) => handleChange(field.id, e.target.value)}
                value={formData[field.id] || ''}
              >
                {field.options.map((opt: string, i: number) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            ) : field.type === "radio" || field.type === "checkbox" ? (
              <div className="space-y-1">
                <div className="flex gap-2 items-center">
                  <strong>Options:</strong>
                  <button
                    className="text-green-600"
                    onClick={() => updateField(field.id, { options: [...field.options, `Option ${field.options.length + 1}`] })}
                  >
                    + Add
                  </button>
                </div>
                {field.options.map((opt: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    {field.type === "radio" ? (
                      <input
                        type="radio"
                        name={field.id}
                        value={opt}
                        checked={formData[field.id] === opt}
                        onChange={(e) => handleChange(field.id, opt)}
                      />
                    ) : (
                      <input
                        type="checkbox"
                        value={opt}
                        onChange={(e) => {
                          const prev = formData[field.id] || [];
                          const updated = e.target.checked
                            ? [...prev, opt]
                            : prev.filter((val: string) => val !== opt);
                          handleChange(field.id, updated);
                        }}
                        checked={(formData[field.id] || []).includes(opt)}
                      />
                    )}
                    <input
                      className="border p-1 flex-1"
                      value={opt}
                      onChange={(e) => {
                        const updated = [...field.options];
                        updated[i] = e.target.value;
                        updateField(field.id, { options: updated });
                      }}
                    />
                    <button
                      className="text-red-500"
                      onClick={() => {
                        const updated = field.options.filter((_: any, idx: number) => idx !== i);
                        updateField(field.id, { options: updated });
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : field.type === "date" || field.type === "time" || field.type === "range" ? (
              <input
                type={field.type}
                className="border p-2 w-full"
                onChange={(e) => handleChange(field.id, e.target.value)}
                value={formData[field.id] || ''}
              />
            ) : null}
          </div>
        ))}

        {fields.length > 0 && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded self-start"
            onClick={handleSubmit}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;
